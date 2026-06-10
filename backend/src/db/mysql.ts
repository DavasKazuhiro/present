import fs from 'node:fs'
import path from 'node:path'
import mysql, {
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from 'mysql2/promise'
import { env } from '../config/env'

let pool: Pool | null = null
type QueryClient = Pool | PoolConnection
type QueryParams = NonNullable<Parameters<Pool['execute']>[1]>

function getPool() {
  if (!pool) throw new Error('Banco não inicializado. Execute initDb() primeiro.')
  return pool
}

export async function initDb() {
  const bootstrap = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    multipleStatements: true,
  })

  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${env.MYSQL_DATABASE}\``)
  await bootstrap.end()

  pool = mysql.createPool({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  })

  await importPresentSchema()
  await ensureRuntimeSchema()
  await run(`
    CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
      id BIGINT NOT NULL AUTO_INCREMENT,
      usuario_id INT NOT NULL,
      token_hash VARCHAR(64) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      revoked_at DATETIME NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_auth_refresh_tokens_usuario_id (usuario_id),
      CONSTRAINT fk_auth_refresh_tokens_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

async function ensureColumn(table: string, column: string, definition: string) {
  const existing = await get<{ column_name: string }>(
    `SELECT COLUMN_NAME AS column_name
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
     LIMIT 1`,
    [env.MYSQL_DATABASE, table, column]
  )

  if (!existing) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${definition}`)
  }
}

async function ensureRuntimeSchema() {
  await ensureColumn('turmas', 'descricao', '`descricao` text NULL')
  await ensureColumn('turmas', 'cor', "`cor` varchar(20) NOT NULL DEFAULT '#2563eb'")
  await ensureColumn('chamadas', 'titulo', '`titulo` varchar(120) DEFAULT NULL')
  await ensureColumn('chamadas', 'aberta_ate', '`aberta_ate` datetime DEFAULT NULL')
  await ensureColumn('chamadas', 'raio_metros', '`raio_metros` int NOT NULL DEFAULT 20')
  await ensureColumn('chamadas', 'encerrada_em', '`encerrada_em` datetime DEFAULT NULL')
  await ensureColumn('chamadas', 'status', "`status` varchar(20) NOT NULL DEFAULT 'open'")
  await ensureColumn('chamadas', 'total_matriculados', '`total_matriculados` int NOT NULL DEFAULT 0')
  await ensureColumn('chamadas', 'total_respondidos', '`total_respondidos` int NOT NULL DEFAULT 0')
  await ensureColumn('chamada_alunos', 'data_resposta', '`data_resposta` timestamp NULL DEFAULT CURRENT_TIMESTAMP')
  await ensureColumn('chamada_alunos', 'latitude', '`latitude` decimal(10,8) DEFAULT NULL')
  await ensureColumn('chamada_alunos', 'longitude', '`longitude` decimal(11,8) DEFAULT NULL')
  await ensureColumn('chamada_alunos', 'distancia_metros', '`distancia_metros` decimal(10,2) DEFAULT NULL')
  await ensureColumn('turma_alunos', 'status', "`status` varchar(20) NOT NULL DEFAULT 'active'")
  await run(`
    CREATE TABLE IF NOT EXISTS turma_horarios (
      id int NOT NULL AUTO_INCREMENT,
      turma_id int NOT NULL,
      dia_semana tinyint NOT NULL,
      hora_inicio time NOT NULL,
      hora_fim time NOT NULL,
      criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_turma_horarios_turma_id (turma_id),
      CONSTRAINT fk_turma_horarios_turma
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  await run(`
    CREATE TABLE IF NOT EXISTS convite_links (
      id int NOT NULL AUTO_INCREMENT,
      turma_id int NOT NULL,
      token varchar(64) NOT NULL UNIQUE,
      criado_por int NOT NULL,
      expira_em datetime NULL,
      max_usos int NULL,
      usos int NOT NULL DEFAULT 0,
      ativo tinyint(1) NOT NULL DEFAULT 1,
      criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_convite_links_turma_id (turma_id),
      CONSTRAINT fk_convite_links_turma
        FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
      CONSTRAINT fk_convite_links_professor
        FOREIGN KEY (criado_por) REFERENCES professores(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

async function importPresentSchema() {
  const scriptPath = path.resolve(process.cwd(), env.DB_INIT_SCRIPT)
  const raw = fs.readFileSync(scriptPath, 'utf-8')

  // Remove comentários especiais do dump (/*! ... */) e comentários de linha.
  const withoutMysqlDirectives = raw.replace(/\/\*![\s\S]*?\*\//g, '')
  const withoutLineComments = withoutMysqlDirectives
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  // Executa apenas estrutura de tabelas do dump, sem apagar dados em cada boot.
  const statements = withoutLineComments
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s.toUpperCase().startsWith('CREATE TABLE'))
    .map((s) => s.replace(/^CREATE TABLE\s+/i, 'CREATE TABLE IF NOT EXISTS '))

  await run('SET FOREIGN_KEY_CHECKS = 0')
  try {
    for (const statement of statements) {
      await run(statement)
    }
  } finally {
    await run('SET FOREIGN_KEY_CHECKS = 1')
  }
}

export async function run(
  sql: string,
  params: QueryParams = [],
  client: QueryClient = getPool()
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await client.execute<ResultSetHeader>(sql, params)
  return { insertId: result.insertId, affectedRows: result.affectedRows }
}

export async function get<T = RowDataPacket>(
  sql: string,
  params: QueryParams = [],
  client: QueryClient = getPool()
): Promise<T | null> {
  const [rows] = await client.execute<RowDataPacket[]>(sql, params)
  return (rows[0] as T | undefined) ?? null
}

export async function all<T = RowDataPacket>(
  sql: string,
  params: QueryParams = [],
  client: QueryClient = getPool()
): Promise<T[]> {
  const [rows] = await client.execute<RowDataPacket[]>(sql, params)
  return rows as T[]
}

export async function transaction<T>(callback: (client: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

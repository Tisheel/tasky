import { FieldPacket, QueryError, QueryResult, ResultSetHeader, RowDataPacket, createPool } from "mysql2"
import access from "../config/mysql.js"
import { Board, User } from "../utils/types.js"

const pool = createPool(access)

export const insertUser = (user: User, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute(
        'INSERT INTO users (name, email, password, profile) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.profile],
        cb
    )
}

export const getUserById = (id: string, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT name, email, profile FROM users WHERE id = ?',
        [id],
        cb
    )
}

export const getUserByEmail = (id: string, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT id, password FROM users WHERE email = ?',
        [id],
        cb
    )
}

export const insertBoard = (board: Board, userId: string, cb: (err: QueryError | null, result?: ResultSetHeader, fields?: FieldPacket[]) => any) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err)
            return
        }
        conn.beginTransaction((err) => {
            if (err) {
                cb(err)
                conn.release()
                return
            }
            conn.execute('INSERT INTO board (title) VALUES (?)', [board.title], (err, result: ResultSetHeader) => {
                if (err) {
                    cb(err)
                    conn.rollback(() => {
                        conn.release()
                    })
                    return
                }
                const boardId = result.insertId
                conn.execute('INSERT INTO board_members (board_id, user_id) VALUES (?, ?)', [boardId, userId], (err, result: ResultSetHeader) => {
                    if (err) {
                        cb(err)
                        conn.rollback(() => {
                            conn.release()
                        })
                        return
                    }
                    conn.commit((err) => {
                        if (err) {
                            return conn.rollback(() => {
                                conn.release()
                            })
                        }
                        cb(err, result)
                        conn.release()
                    })
                })
            })
        })
    })
}
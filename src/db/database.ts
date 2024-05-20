import { FieldPacket, QueryError, QueryResult, ResultSetHeader, RowDataPacket, createPool } from "mysql2"
import access from "../config/mysql.js"
import { Board, Task, User } from "../utils/types.js"

const pool = createPool(access)

export const insertUser = (user: User, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute(
        'INSERT INTO users (name, email, password, profile) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.profile],
        cb
    )
}

export const getUserById = (id: number, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT name, email, profile FROM users WHERE id = ?',
        [id],
        cb
    )
}

export const getUserByEmail = (email: string, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT id, password FROM users WHERE email = ?',
        [email],
        cb
    )
}

export const insertBoard = (board: Board, userId: number, cb: (err: QueryError | null, result?: ResultSetHeader, fields?: FieldPacket[]) => any) => {
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
                conn.execute('INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, "admin")', [boardId, userId], (err, result: ResultSetHeader) => {
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
                        result.insertId = boardId
                        cb(err, result)
                        conn.release()
                    })
                })
            })
        })
    })
}

export const insertBoardMembers = (board_id: number, user_id: number, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute(
        'INSERT INTO board_members (board_id, user_id) VALUES (?, ?)',
        [board_id, user_id],
        cb
    )
}

export const getboardMemberRole = (board_id: number, user_id: number, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT role FROM board_members WHERE board_id = ? AND user_id = ?',
        [board_id, user_id],
        cb
    )
}

export const deleteBoardMember = (board_id: number, user_id: number, cb: (err: QueryError | null, result?: ResultSetHeader, fields?: FieldPacket[]) => any) => {
    pool.execute('SELECT COUNT(board_id) FROM board_members WHERE board_id = ?', [board_id], (err, result: RowDataPacket[]) => {
        if (err) {
            cb(err)
            return
        }
        if (result[0]['COUNT(board_id)'] === 1) {
            pool.execute('DELETE FROM board WHERE id = ?', [board_id], (err, result: ResultSetHeader, field) => {
                cb(err, result, field)
            })
        } else {
            pool.execute('DELETE FROM board_members WHERE board_id = ? AND user_id = ?', [board_id, user_id], (err, result: ResultSetHeader, fields) => {
                cb(err, result, fields)
            })
        }
    })
}

export const deleteBoard = (board_id: number, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute('DELETE FROM board WHERE id = ?', [board_id], cb)
}

export const insertTask = (board_id: number, task: Task, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute(
        'INSERT INTO tasks (board_id, title, description, status, deadline, priority) VALUES (?, ?, ?, ?, ?, ?)',
        [board_id, task.title, task.description, task.status, task.deadline, task.priority],
        cb
    )
}

export const getTasksByBoardId = (board_id: number, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT * FROM tasks WHERE board_id = ?',
        [board_id],
        cb
    )
}

export const deleteTaskById = (task_id: number, cb: (err: QueryError | null, result: ResultSetHeader, fields: FieldPacket[]) => any) => {
    pool.execute(
        'DELETE FROM tasks WHERE id = ?',
        [task_id],
        cb
    )
}

export const getBoardMembers = (board_id: number, cb: (err: QueryError | null, result: RowDataPacket[], fields: FieldPacket[]) => any) => {
    pool.execute(
        'SELECT user_id, name, email, profile, role FROM board_members JOIN users ON board_members.user_id = users.id WHERE board_id = ?',
        [board_id],
        cb
    )
}
import sqlite3 from "sqlite3"

const db = new sqlite3.Database("./db.sqlite3")
db.run(`CREATE TABLE IF NOT EXISTS sets (
  name varchar(255),
  questions varchar(30000),
  user varchar(255),
  id varchar(10)
)`)
db.run(`CREATE TABLE IF NOT EXISTS progress (
  id varchar(10),
  user varchar(255),
  progress varchar(30000)
)`)

export function createSet({ name, questions, user, id }) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO sets VALUES (?,?,?,?)", [name, JSON.stringify(questions), user, id], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
export function getSet(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM sets WHERE id=?", [id], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export function createProgress({ id, user, progress }) {
  console.log(id, user, progress)

  return new Promise((resolve, reject) => {
    db.run("INSERT INTO progress VALUES (?,?,?)", [id, user, JSON.stringify(progress)], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
export function updateProgress({ id, user, progress }) {
  console.log(id, user, progress)
  return new Promise((resolve, reject) => {
    db.run("UPDATE progress SET progress = ? WHERE id = ? and user = ?", [JSON.stringify(progress), id, user], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
export function getProgress(id, user) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT progress FROM progress WHERE id=? AND user=? ORDER BY ROWID DESC",
      [id, user],
      (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      }
    )
  })
}

export function latest() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM sets ORDER BY ROWID DESC LIMIT 6", (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function see() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM progress", (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

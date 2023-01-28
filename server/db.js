import sqlite3 from "sqlite3"
import { v4 } from 'uuid';

const db = new sqlite3.Database("./db.sqlite3")
db.run(`CREATE TABLE IF NOT EXISTS sets (
  name varchar(255),
  questions varchar(30000),
  user varchar(255),
  id varchar(10)
)`)
db.run(`CREATE TABLE IF NOT EXISTS progress (
  setId varchar(10),
  userId varchar(255),
  points int
)`)
db.run(`CREATE TABLE IF NOT EXISTS users (
  id varchar(10),
  user varchar(255),
  email varchar(255),
  fname varchar(255)
)`)

export function userExists(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email=?", [email], (err, data) => {
      if (err) {
        reject(err)
      } else {
        data ? resolve(data.id) : resolve(false)
      }
    })
  })
}

export function createUser({ id=v4(), user, email, fname }) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users VALUES (?,?,?,?)", [id, user, email, fname], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(id)
      }
    })
  })
}

export function createSet({ name, questions, user, id }) {
  return new Promise((resolve, reject) => {
    getSet(id).then((set) => {
      if (set) {

        db.run("UPDATE sets SET name=?, questions=?, user=? WHERE id=?", [name, JSON.stringify(questions), user, id], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(id)
          }
      })
      } else {
    db.run("INSERT INTO sets VALUES (?,?,?,?)", [name, JSON.stringify(questions), user, id], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
      }
    });
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

export function progressExists({id, set}) {
  // id = user id
  // set = set id
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM progress WHERE userId=? AND setId=?", [id, set], (err, data) => {
      if (err) {
        reject(err)
      } else {
        data ? resolve(data.points) : resolve(false)
      }
    })
  })
}

export function setProgress({ id, user, points }) {
  // id = set id
  // user = user id
  // points = points to add
  return new Promise((resolve, reject) => {
    progressExists({set: id, id: user}).then(exists => {
      if(exists !== false) {
    db.run("UPDATE progress SET points = ? WHERE setId = ? and userId = ?", [exists+points, id, user], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(exists+points)
      }
    })
      } else {
    db.run("INSERT INTO progress VALUES (?,?,?)", [id, user, points], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(points)
      }
    })
  };
});
  })
}

export function deleteProgress({ id, user }) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM progress WHERE setId = ? and userId = ?", [id, user], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function updateSet(setid, questions) {
  return new Promise((resolve, reject) => {
    db.run("UPDATE sets SET questions = ? WHERE id = ?", [JSON.stringify(questions), setid], (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function getAllSets() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM sets", (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export async function finishResource({ id, user }) {
  let current = await progressExists({set: id, id: user});
  if(current) {
    return true
  } else {
    await setProgress({id, user, points: 500});
    return false
  }
};

export function latest() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM sets ORDER BY ROWID DESC", (err, rows) => {
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

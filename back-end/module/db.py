import pymysql

# DATABASE_HOST = ""
# DATABASE_USER = ""
# DATABASE_PASSWORD = ""

DATABASE_DB = "singking_db"
DATABASE_PORT = 3306

DATABASE_HOST = "localhost"
DATABASE_USER = "root"
DATABASE_PASSWORD = "1541"

# Database 클래스는 MySQL 데이터베이스와 연결을 담당
class Database:
    def __init__(self):                                          
        self.conn = pymysql.connect(                               # (1) MYSQL Connection 연결 (연결자 = pymysql.connect(연결옵션))
            host=DATABASE_HOST,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            port=DATABASE_PORT,
            db=DATABASE_DB,
            charset="utf8",
        )  
        self.cursor = self.conn.cursor(pymysql.cursors.DictCursor) # (2) 연결자로 부터 DB를 조작할 Cusor 생성 (커서이름 = 연결자.cursor()) 

    def db_login(self, user_id, user_password):
        try:

            SQL = 'SELECT * FROM singking_db.user_info WHERE user_id = %s AND user_pw = %s'
            self.cursor.execute(SQL, (user_id, user_password))
            data = self.cursor.fetchall()

            if data!=():
                return {'status':'success', 'user_id': data}
            else:
                return {'status':'fail'}
        except:
            return {'message':'error'}
    
    def db_register(self, user_id, user_name, user_age, user_gender, user_pw):
        try:
            SQL = '''INSERT INTO singking_db.user_info (user_id, user_name, user_age, user_gender, user_pw, user_membership)
            VALUES (%s, %s, %s, %s,  %s, %s)'''

            self.cursor.execute(SQL, (user_id, '테스트 이름', 25, 'm', user_pw, 'X'))
            self.conn.commit()
            return {'status':'success'}
        except:
            return {'message':'fail'}
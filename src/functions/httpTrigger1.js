const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');

const config = {
    host: process.env.MYSQL_HOST || "testmysqlflex.mysql.database.azure.com",
    user: process.env.MYSQL_USER || "mysqladmin",
    password: process.env.MYSQL_PASSWORD || "Password@123",
    database: process.env.MYSQL_DATABASE || "test",
    port: process.env.MYSQL_PORT || "3306",
    ssl: {
        rejectUnauthorized: true
    }
};

//const connectionString = process.env['MySQLConnectionString'];
//{host: "testmysqlflex.mysql.database.azure.com", user: "mysqladmin", password: "Password@123", database: "test", port: "3306", ssl: { rejectUnauthorized: true }}


// if (connectionString) {
//     config = JSON.parse(connectionString);
// }


// Add Student Function
app.http('addStudent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Adding a new student.');

        try {
            const student = await request.json();

            const connection = await mysql.createConnection(config);
            const query = 'INSERT INTO Students (student_name, student_age, student_addr, student_percent, student_qual, student_year_passed) VALUES (?, ?, ?, ?, ?, ?)';
            const [results] = await connection.execute(query, [
                student.student_name,
                student.student_age,
                student.student_addr,
                student.student_percent,
                student.student_qual,
                student.student_year_passed
            ]);

            await connection.end();

            return {
                status: 200,
                body: "Student added successfully!"
            };
        } catch (error) {
            context.log.error(`Error adding student: ${error.message}`);
            return {
                status: 500,
                body: `Error adding student: ${error.message}`
            };
        }
    }
});

// Get Students Function
app.http('getStudents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Retrieving students.');

        try {
            const connection = await mysql.createConnection(config);
            const [results] = await connection.execute('SELECT * FROM Students');

            await connection.end();

            return {
                status: 200,
                body: JSON.stringify(results)
            };
        } catch (error) {
            context.log.error(`Error retrieving students: ${error.message}`);
            return {
                status: 500,
                body: `Error retrieving students: ${error.message}`
            };
        }
    }
});

// Update Student Function
app.http('updateStudent', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Updating student.');

        try {
            const student = await request.json();

            const connection = await mysql.createConnection(config);
            const query = 'UPDATE Students SET student_name = ?, student_age = ?, student_addr = ?, student_percent = ?, student_qual = ?, student_year_passed = ? WHERE student_id = ?';
            const [results] = await connection.execute(query, [
                student.student_name,
                student.student_age,
                student.student_addr,
                student.student_percent,
                student.student_qual,
                student.student_year_passed,
                student.student_id
            ]);

            await connection.end();

            return {
                status: 200,
                body: "Student updated successfully!"
            };
        } catch (error) {
            context.log.error(`Error updating student: ${error.message}`);
            return {
                status: 500,
                body: `Error updating student: ${error.message}`
            };
        }
    }
});

// Delete Student Function
app.http('deleteStudent', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.get('id');
        context.log(`Deleting student with ID: ${id}`);

        try {
            const connection = await mysql.createConnection(config);
            const query = 'DELETE FROM Students WHERE student_id = ?';
            const [results] = await connection.execute(query, [id]);

            await connection.end();

            if (results.affectedRows > 0) {
                return {
                    status: 200,
                    body: "Student deleted successfully!"
                };
            } else {
                return {
                    status: 404,
                    body: "Student not found."
                };
            }
        } catch (error) {
            context.log.error(`Error deleting student: ${error.message}`);
            return {
                status: 500,
                body: `Error deleting student: ${error.message}`
            };
        }
    }
});

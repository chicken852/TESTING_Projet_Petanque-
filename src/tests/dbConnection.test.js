// dbConnection.test.js
require('dotenv').config();  
const { Pool } = require('pg'); 
jest.mock('pg'); 
describe('Database Connection', () => {
    let pool;

    beforeAll(() => {
       
        pool = new Pool();  
    });

    it('should create a connection pool', () => {
        
        expect(pool).toBeInstanceOf(Pool);  
    });

    it('should connect to the database successfully', async () => {
       
        const mockConnect = jest.fn().mockResolvedValueOnce('Connected');
        pool.connect = mockConnect;  
       
        await pool.connect();

        
        expect(mockConnect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
        
        const mockConnect = jest.fn().mockRejectedValueOnce(new Error('Connection failed'));
        pool.connect = mockConnect;

       
        try {
            await pool.connect();
        } catch (error) {
            expect(error).toEqual(new Error('Connection failed'));
        }
    });
});

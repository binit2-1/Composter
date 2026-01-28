import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env.test') });

const getTestUser = () => {
    const uniqueId = Math.floor(Math.random() * 100000);
    return {
        name: `Test User ${uniqueId}`,
        email: `test${uniqueId}@example.com`,
        password: `testpassword${uniqueId}`
    }
}

test.describe('AUTH endpoints test', ()=>{
    // Run tests serially - they depend on each other
    test.describe.configure({ mode: 'serial' });
    
    const API_URL = process.env.API_URL;
    const user = getTestUser();

    test('should register a new user', async({request}) =>{
        const res = await request.post(`${API_URL}/api/auth/sign-up/email`, {
            headers:{
                'Content-Type': 'application/json',
            },
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        })
        expect(res.status()).toBe(200);
        
    })

    test('should login with correct credentials', async({request}) =>{
        const res = await request.post(`${API_URL}/api/auth/sign-in/email`, {
            headers:{
                'Content-Type': 'application/json',
            },
            data: { 
                email: user.email,
                password: user.password,
            }
        })
        expect(res.status()).toBe(200);
    })

    test('should not register with existing email', async({request})=>{
        const res = await request.post(`${API_URL}/api/auth/sign-up/email`, {
            headers:{
                'Content-Type': 'application/json',
            },
            data: {
                email: user.email,
                password: user.password,
            }
        })
        expect(res.status()).toBe(400);
    })

    test('should not login with wrong password', async({request})=>{
        const res = await request.post(`${API_URL}/api/auth/sign-in/email`, {
            headers:{
                'Content-Type': 'application/json',
            },
            data: {
                email: user.email,
                password: 'wrongpassword',
            }
        })
        expect(res.status()).toBe(401);
    })
})
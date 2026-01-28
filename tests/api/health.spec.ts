import {test, expect } from "@playwright/test";

test('API Health Check', async({request}) =>{
    const response = await request.get('api/health')
    expect(response.ok()).toBeTruthy()
})
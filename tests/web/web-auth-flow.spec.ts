import {test, expect} from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../apps/api/.env.test') });

const getTestUser = () => {
    return {
        name: `UI Tester ${Date.now()}`,
        email: `ui_test_${Date.now()}@example.com`,
        password: 'Password123!'
    }
}

const USER = getTestUser();

test.describe('web auth flow test', ()=>{
    test.describe.configure({ mode: 'serial' });    
    
    test('register new user', async({page})=>{
        await page.goto('/signup');

        const nameInput = page.getByLabel(/name/i);
        const emailInput = page.getByLabel(/email/i);
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        const submitRegBtn = page.getByRole('button', {name: /create/i})    

        await nameInput.fill(USER.name);
        await emailInput.fill(USER.email);
        await passwordInput.fill(USER.password);

        await submitRegBtn.click();

        await page.waitForURL('/app')
        await expect(page).toHaveURL('/app')
    })

    test('login existing user', async({page})=>{
        await page.goto('/login');

        const emailInput = page.getByLabel(/email/i);
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        const submitLoginBtn = page.getByRole('button', {name: /sign in/i})    

        await emailInput.fill(USER.email);
        await passwordInput.fill(USER.password);

        await submitLoginBtn.click();

        await page.waitForURL('/app')
        await expect(page).toHaveURL('/app')
    })
})

const API_URL = 'https://api-menu-9b5g.onrender.com';

async function getMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) throw new Error('falló');
        return await response.json();
    }
    catch (error) {
        throw error;
    }
}

export {getMenu};
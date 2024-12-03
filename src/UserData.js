
class UserData {
    constructor() {
        this.data = {};
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        this.data = JSON.parse(localStorage.getItem('userData')) || {};
    }

    saveToLocalStorage() {
        localStorage.setItem('userData', JSON.stringify(this.data));
    }

    set(key, value) {
        this.data[key] = value;
        this.saveToLocalStorage();
    }

    get(key) {
        return this.data[key];
    }

    getAttempt(levelID) {
        return this.data?.attempts?.[levelID];
    }

    setAttempt(levelID, attempt) {
        if (!this.data.attempts) {
            this.data.attempts = {};
        }
        this.data.attempts[levelID] = attempt;
        this.saveToLocalStorage();
    }
}

const userData = new UserData();

export default userData;

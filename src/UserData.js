class UserData {
    constructor() {
        this.data = {};
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            this.data = JSON.parse(localStorage.getItem('userData'));
            console.log('Loaded user data from local storage', this.data);
            if(typeof this.data !== 'object' || this.data === null) {
                throw new Error('Invalid data in local storage');
            }
        }catch{
            console.error('Error loading user data from local storage');
            this.data = {};
            this.saveToLocalStorage();
        }
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

    hasAttempted(levelID) {
        return this.data?.attempts?.hasOwnProperty(levelID);
    }

    getAttempt(levelID, key) {
        if (!this.data?.attempts) {
            return undefined;
        }
        if (!this.data?.attempts[levelID]) {
            return undefined;
        }
        return this.data.attempts[levelID][key];
    }

    setAttempt(levelID, key, value) {
        if (!this.data.attempts) {
            this.data.attempts = {};
        }
        if (!this.data.attempts[levelID]) {
            this.data.attempts[levelID] = {};
        }
        this.data.attempts[levelID][key] = value;
        this.saveToLocalStorage();
    }
}

const userData = new UserData();

export default userData;

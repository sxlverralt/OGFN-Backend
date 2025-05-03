const Redis = require('ioredis');
const Keyv = require('keyv');

// Configurazione: Usa Redis o la memoria locale
const Use_Redis = false; // Cambia a `true` per usare Redis
const redis = Use_Redis ? new Redis() : null;

class KV {
    /**
     * Ottieni un valore dalla memoria o da Redis.
     * @param {string} key - La chiave da recuperare.
     * @returns {Promise<any>} Il valore associato alla chiave.
     */
    async get(key) {
        if (Use_Redis && redis) {
            return await redis.get(key);
        } else {
            return await memkv.get(key);
        }
    }

    /**
     * Imposta un valore nella memoria o in Redis.
     * @param {string} key - La chiave da impostare.
     * @param {any} value - Il valore da salvare.
     * @returns {Promise<boolean>} Esito dell'operazione.
     */
    async set(key, value) {
        if (Use_Redis && redis) {
            const set = await redis.set(key, value);
            return set === 'OK';
        } else {
            return await memkv.set(key, value);
        }
    }

    /**
     * Imposta un valore con un TTL (tempo di scadenza) nella memoria o in Redis.
     * Nota: Keyv in memoria locale non supporta TTL nativamente.
     * @param {string} key - La chiave da impostare.
     * @param {any} value - Il valore da salvare.
     * @param {number} ttl - Tempo di vita (in secondi).
     * @returns {Promise<boolean>} Esito dell'operazione.
     */
    async setTTL(key, value, ttl) {
        if (Use_Redis && redis) {
            const set = await redis.set(key, value, 'EX', ttl);
            return set === 'OK';
        } else {
            // Implementazione manuale del TTL per memoria locale
            await memkv.set(key, value);
            setTimeout(() => memkv.delete(key), ttl * 1000); // Elimina la chiave dopo il TTL
            return true;
        }
    }

    /**
     * Elimina una chiave dalla memoria o da Redis.
     * @param {string} key - La chiave da eliminare.
     * @returns {Promise<boolean>} Esito dell'operazione.
     */
    async delete(key) {
        if (Use_Redis && redis) {
            const del = await redis.del(key);
            return del > 0;
        } else {
            return await memkv.delete(key);
        }
    }
}

module.exports = new KV();

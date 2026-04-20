/**
 * Rate Limiter Simples (In-Memory)
 * Previne abuso de API endpoints
 *
 * Nota: Para produção, usar Redis ou serviço externo
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private records = new Map<string, RateLimitRecord>();

  /**
   * Verificar se key excedeu o limite
   * @param key Identificador único (ex: IP, user ID)
   * @param limit Máximo de requisições permitidas
   * @param windowMs Janela de tempo em ms
   * @returns true se está dentro do limite, false se excedeu
   */
  check(key: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.records.get(key);

    // Se não existe ou expirou, criar novo
    if (!record || now > record.resetAt) {
      this.records.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    // Se ainda está na janela
    if (record.count < limit) {
      record.count++;
      return true;
    }

    // Excedeu o limite
    return false;
  }

  /**
   * Obter tempo até reset (em ms)
   */
  getResetTime(key: string): number {
    const record = this.records.get(key);
    if (!record) return 0;

    const now = Date.now();
    const timeUntilReset = record.resetAt - now;
    return Math.max(0, timeUntilReset);
  }

  /**
   * Limpar registros expirados (executar periodicamente)
   */
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetAt) {
        this.records.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Limpar registros expirados a cada 5 minutos
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

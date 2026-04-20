'use client';

/**
 * Detector de Conectividade
 * Monitora status online/offline do navegador
 */

type OfflineListener = (isOnline: boolean) => void;

class OfflineDetector {
  private listeners = new Set<OfflineListener>();
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  private handleOnline() {
    if (!this.isOnline) {
      this.isOnline = true;
      console.log('🟢 Voltou online');
      this.notifyListeners();
    }
  }

  private handleOffline() {
    if (this.isOnline) {
      this.isOnline = false;
      console.warn('🔴 Conexão perdida');
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.isOnline);
    }
  }

  /**
   * Registrar listener para mudanças de conectividade
   */
  subscribe(listener: OfflineListener): () => void {
    this.listeners.add(listener);

    // Retornar função para remover listener (unsubscribe)
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Verificar status atual
   */
  getStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Obter texto de status para UI
   */
  getStatusText(): string {
    return this.isOnline ? '🟢 Online' : '🔴 Offline';
  }
}

export const offlineDetector = new OfflineDetector();

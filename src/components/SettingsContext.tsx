import { useCallback, useSyncExternalStore } from 'react';
import { z } from 'zod';

export const SiteSettingsSchema = z.object({
  isDark: z.boolean().default(false),
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

const initialSettings = SiteSettingsSchema.parse({});

class SyncSubscription {
  private listeners: (() => void)[] = [];

  public subscribe = (listener: () => void) => {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  };

  public emitChange() {
    this.listeners.forEach(listener => listener());
  }
}

class SettingsStore {
  private settings: SiteSettings = initialSettings;

  private subscriptions: Record<keyof SiteSettings, SyncSubscription> =
    Object.fromEntries(
      Object.keys(this.settings).map(key => [key, new SyncSubscription()])
    ) as Record<keyof SiteSettings, SyncSubscription>;

  public save() {
    window.localStorage.setItem('siteSettings', JSON.stringify(this.settings));
  }

  public load() {
    const settings = window.localStorage.getItem('siteSettings');
    if (settings) {
      try {
        const json: unknown = JSON.parse(settings);
        this.settings = SiteSettingsSchema.parse(json);
        Object.values(this.subscriptions).forEach(sub => sub.emitChange());
      } catch (e) {
        console.error('Failed to load settings', e);
        this.save();
      }
    }
  }

  public set<const T extends keyof SiteSettings>(
    key: T,
    value: SiteSettings[T]
  ) {
    this.settings[key] = value;
    this.save();
    this.subscriptions[key].emitChange();
  }

  public get<const T extends keyof SiteSettings>(key: T): SiteSettings[T] {
    return this.settings[key];
  }

  public getSubscriber<const T extends keyof SiteSettings>(
    key: T
  ): (listener: () => void) => () => void {
    return this.subscriptions[key].subscribe;
  }
}

// clean up old settings
(() => {
  window.localStorage.removeItem('theme');
  window.localStorage.removeItem('isdark');
  window.localStorage.removeItem('isDark');
  window.localStorage.removeItem('searchQuery');
  window.localStorage.removeItem('tab');
})();

const settingsStore = new SettingsStore();
settingsStore.load();

export { settingsStore };

export function useSettings<const T extends keyof SiteSettings>(key: T) {
  const getter = useCallback(() => settingsStore.get(key), [key]);
  const setter = useCallback(
    (value: SiteSettings[T]) => settingsStore.set(key, value),
    [key]
  );
  const value = useSyncExternalStore(settingsStore.getSubscriber(key), getter);
  return [value, setter] as const;
}

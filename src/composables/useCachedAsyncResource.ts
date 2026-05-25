import { onMounted, onServerPrefetch, ref, shallowRef, watch, type WatchSource } from 'vue'

type CacheResult<T> = { hit: true; value: T | undefined } | { hit: false }

export function useCachedAsyncResource<T>(
	keySource: WatchSource<string>,
	readCache: (key: string) => CacheResult<T>,
	load: (key: string) => Promise<T | undefined>,
) {
	const readKey = () => (typeof keySource === 'function' ? keySource() : keySource.value)
	const initial = readCache(readKey())
	const data = shallowRef<T | undefined>(initial.hit ? initial.value : undefined)
	const isLoading = ref(!initial.hit)

	async function loadKey(key = readKey()) {
		const cached = readCache(key)
		if (cached.hit) {
			data.value = cached.value
			isLoading.value = false
			return cached.value
		}

		isLoading.value = true
		try {
			const loaded = await load(key)
			data.value = loaded
			return loaded
		} finally {
			isLoading.value = false
		}
	}

	onServerPrefetch(() => loadKey())

	onMounted(() => {
		if (!readCache(readKey()).hit) void loadKey()
	})

	watch(keySource, (key) => {
		void loadKey(key)
	})

	return { data, isLoading, load: loadKey }
}

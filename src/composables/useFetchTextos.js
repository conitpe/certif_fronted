import { ref, onMounted } from "vue";

export function useFetchTextos(pagina) {
    const textos = ref({});

    const cargarTextos = async () => {
        try {
            const response = await fetch("/textos.json");
            const data = await response.json();
            textos.value = data[pagina] || {};
        } catch (error) {
            console.error("Error al cargar los textos:", error);
        }
    };

    onMounted(cargarTextos);

    return { textos };
}

<template>
    <span v-if="shouldShow" class="text-danger small">
        {{ message }}
    </span>
</template>

<script>
export default {
    name: 'ValidationError',
    props: {

        value: {
            type: [String, Array],
            required: true
        },

        message: {
            type: String,
            default: 'El campo es obligatorio.'
        }
    },
    computed: {
        shouldShow() {
            if (Array.isArray(this.value)) {
                return this.value.length === 0;
            }
            return !this.value || !String(this.value).trim();
        }
    }
}
</script>
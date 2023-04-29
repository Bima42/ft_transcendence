import { defineStore } from 'pinia'
import { ref, shallowRef } from "vue"
import type { Component } from "vue"
import type { Ref } from "vue"


export const useModalStore = defineStore('modal', () => {
    const show = ref(false)
    const type: Ref<{}> & { "[ShallowRefMarker]"?: true } = shallowRef({})
    const component: Ref<{}> & { "[ShallowRefMarker]"?: true } = shallowRef({})
    const data = ref({})

    const resetState = function () {
        show.value = false
        type.value = {}
        component.value = {}
        data.value = {}
    }

    const resetStateKeepData = function () {
        show.value = false
        type.value = {}
        component.value = {}
    }

    const loadAndDisplay = function (newType: Component, newComponent: Component, newData: any) {
        type.value = newType;
        component.value = newComponent;
        data.value = newData;
        show.value = true;
    }

    const toggleModal = function () {
        show.value = !show.value
    }

    return {
        show,
        type,
        component,
        data,
        resetState,
        resetStateKeepData,
        loadAndDisplay,
        toggleModal,
    }
})
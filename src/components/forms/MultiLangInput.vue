<script setup>
const model = defineModel();
const props = defineProps({
  propName: {
    required: true,
    type: String,
  },
  isTextarea: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: []
  }
});
</script>

<template>
  <el-form-item :prop="propName+'.en'" :rules="rules">
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.en" placeholder="EN" />
  </el-form-item>
  <el-form-item :prop="propName+'.zh_Hant'" :rules="rules">
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.zh_Hant" placeholder="繁" />
  </el-form-item>
  <el-form-item :prop="propName+'.zh'" :rules="rules">
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.zh" placeholder="简" />
  </el-form-item>
</template>

<style>
</style>
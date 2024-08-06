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
  }
});
</script>

<template>
  <el-form-item :prop="propName+'.en'" required>
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.en" placeholder="EN" />
  </el-form-item>
  <el-form-item :prop="propName+'.zh_Hant'" required>
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.zh_Hant" placeholder="繁" />
  </el-form-item>
  <el-form-item :prop="propName+'.zh'" required>
    <el-input :type="isTextarea?'textarea':'text'" v-model="model.zh" placeholder="简" />
  </el-form-item>
</template>

<style>
</style>
<<<<<<< HEAD
<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
    </div>
  </div>
</template>

<script>

  import '../../../static/tinymce4.7.5/tinymce.min.js'
  import '../../../static/tinymce4.7.5/skins/lightgray/skin.min.css'
  import editorImage from './components/editorImage'
  import plugins from './plugins'
  import toolbar from './toolbar'

  export default {
    name: 'Tinymce',
    components: {editorImage},
    props: {
      id: {
        type: String,
        default: function () {
          return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        type: String,
        default: 'file edit insert view format table'
      },
      height: {
        type: Number,
        required: false,
        default: 360
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false,
        languageTypeList: {
          'en': 'en',
          'zh': 'zh_CN'
        }
      }
    },
    computed: {
      language() {
        return this.languageTypeList[this.$store.getters.language]
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
      },
      language() {
        this.destroyTinymce()
        this.$nextTick(() => this.initTinymce())
      }
    },
    mounted() {
      this.initTinymce()
    },
    activated() {
      this.initTinymce()
    },
    deactivated() {
      this.destroyTinymce()
    },
    destroyed() {
      this.destroyTinymce()
    },
    methods: {
      initTinymce() {
        const _this = this;
        window.tinymce.init({
          language: this.language,
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: this.menubar,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
          },
        })
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId)
        if (this.fullscreen) {
          tinymce.execCommand('mceFullScreen')
        }

        if (tinymce) {
          tinymce.destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
      imageSuccessCBK(arr) {
        const _this = this;
        console.log("zhangjie");
        arr.forEach(v => {
          console.log(v);
          window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="http://${v.url}" >`)
        })
      }
    }
  }
</script>

<style scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container > > > .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
=======
<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
    </div>
  </div>
</template>

<script>
  import editorImage from './components/editorImage'
  import '../../../static/tinymce4.7.5/langs/zh_CN'

  const plugins = [
 `advlist anchor autolink autosave code codesample colorpicker colorpicker
  contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime
  legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace
  spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount`
  ];
  const toolbar = [
    `bold italic underline strikethrough alignleft aligncenter
  alignright outdent indent  blockquote undo redo removeformat`,
    `hr bullist numlist link image charmap	 preview anchor pagebreak
    fullscreen insertdatetime media table forecolor backcolor`
  ];
  export default {
    name: 'tinymce',
    components: {editorImage},
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        default: 'file edit insert view format table'
      },
      height: {
        type: Number,
        required: false,
        default: 360
      },
      width: {
        type: Number,
        required: false,
        default: 720
      }
    },
    data() {
      return {
        hasChange: false,
        hasInit: false,
        tinymceId: this.id || 'vue-tinymce-' + +new Date()
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
        }
      }
    },
    mounted() {
      this.initTinymce()
    },
    activated() {
      this.initTinymce()
    },
    deactivated() {
      this.destroyTinymce()
    },
    methods: {
      initTinymce() {
        const _this = this
        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          width: this.width,
          height: this.height,
          language: 'zh_CN',
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: false,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          }
        })
      },
      destroyTinymce() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
      imageSuccessCBK(arr) {
        const _this = this
        arr.forEach(v => {
          window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        })
      }
    },
    destroyed() {
      this.destroyTinymce()
    }
  }
</script>

<style scoped>
  .tinymce-container {
    position: relative;
  }

  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 10px;
    top: 2px;
    /*z-index: 2005;*/
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
>>>>>>> feature_test

Component({
  externalClasses: ['entry-class'],

  properties:
  {
    picSrc: {
      type: String,
      value: "default"
    },
    entryTitle: {
      type: String,
      value: "default"
    },
    entryName: {
      type: String,
      value: "default"
    },
    entryText: {
      type: String,
      value: "default"
    },
    stateSrc: {
      type: String,
      value: "default"
    }
  },

  data: {
    // 这里是一些组件内部数据
  },

  methods: {
    // 这里是一个自定义方法 ，子父级传参数
    customMethod () { },
  }
});

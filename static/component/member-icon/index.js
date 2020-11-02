Component({
  externalClasses: ['member-icon'],

  properties:
  {
    name: {
      type: String,
      value: ''
    },
    openid: {
      type: String,
      value: ''
    },
    avatarUrl: {
      type: String,
      value: ''
    },
    callback: {
      type: Function,
      value: null
    }
  },

  data: {
  },

  attached: function () {
  },

  detached: function () {
  },

  observers: {
  },

  methods: {
  }
});

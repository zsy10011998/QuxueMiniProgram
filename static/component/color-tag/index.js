Component({
  externalClasses: ['color-tag'],

  properties:
  {
    text: {
      type: String,
      value: 'tbd'
    },
    theme: {
      type: String,
      value: 'blue'
    },
  },

  data: {
    color: undefined,
    backgroundColor: undefined,
    borderColor: undefined
  }
});

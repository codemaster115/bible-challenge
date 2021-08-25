import isEqual from 'deep-equal';

const initialState = {
  list: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE_VERSE':
      console.log(state.list.findIndex(e => isEqual(e, action.payload)) > 0);
      return {
        ...state,
        list:
          state.list.findIndex(e => isEqual(e, action.payload)) > 0
            ? state.list.filter(ele => !isEqual(ele, action.payload))
            : state.list.concat(action.payload),
      };
    default:
      return state;
  }
}

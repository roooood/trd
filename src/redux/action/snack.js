export const SNACK_DATA = 'SNACK_DATA';

export const Snack = object => ({
  type: SNACK_DATA,
  data: object,
});

const initialState = {
  message: '',
  variant: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SNACK_DATA:
      if (action.data == null) {
        return {
          ...initialState,
        };
      };
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};


import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClientRequestPhoto {
  uri: string;
  name?: string;
  type?: string;
}

export interface ClientRequestDraftState {
  serviceId?: number;
  serviceName?: string;
  title: string;
  description: string;
  photos: ClientRequestPhoto[];
  addressId?: number;
  addressLabel?: string;
  availability: 'now' | 'today' | 'tomorrow' | 'custom';
  estimatedPrice?: number;
}

const initialState: ClientRequestDraftState = {
  title: '',
  description: '',
  photos: [],
  availability: 'now',
};

const clientRequestDraftSlice = createSlice({
  name: 'clientRequestDraft',
  initialState,
  reducers: {
    setRequestService: (
      state,
      action: PayloadAction<{ serviceId: number; serviceName?: string }>,
    ) => {
      state.serviceId = action.payload.serviceId;
      state.serviceName = action.payload.serviceName;
    },
    setRequestDescription: (
      state,
      action: PayloadAction<{ title: string; description: string }>,
    ) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
    addRequestPhoto: (state, action: PayloadAction<ClientRequestPhoto>) => {
      if (state.photos.length < 3) {
        state.photos.push(action.payload);
      }
    },
    removeRequestPhoto: (state, action: PayloadAction<number>) => {
      state.photos = state.photos.filter((_, index) => index !== action.payload);
    },
    setRequestAddress: (
      state,
      action: PayloadAction<{ addressId: number; addressLabel?: string }>,
    ) => {
      state.addressId = action.payload.addressId;
      state.addressLabel = action.payload.addressLabel;
    },
    setRequestAvailability: (
      state,
      action: PayloadAction<ClientRequestDraftState['availability']>,
    ) => {
      state.availability = action.payload;
    },
    resetRequestDraft: () => initialState,
  },
});

export const {
  setRequestService,
  setRequestDescription,
  addRequestPhoto,
  removeRequestPhoto,
  setRequestAddress,
  setRequestAvailability,
  resetRequestDraft,
} = clientRequestDraftSlice.actions;

export const clientRequestDraftReducer = clientRequestDraftSlice.reducer;

export const selectClientRequestDraft = (state: any): ClientRequestDraftState =>
  state.clientRequestDraft;

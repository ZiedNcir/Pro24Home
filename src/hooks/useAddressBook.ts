import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
} from '../store/api';

export const useAddressBook = () => {
  const query = useGetAddressesQuery();
  const [addAddress, addAddressState] = useAddAddressMutation();
  const [deleteAddress, deleteAddressState] = useDeleteAddressMutation();

  return {
    ...query,
    addresses: query.data ?? [],
    addAddress,
    deleteAddress,
    addAddressState,
    deleteAddressState,
  };
};

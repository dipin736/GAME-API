import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { BsSearch } from 'react-icons/bs';

const SearchInput = ({onSearch}) => {
  const inputRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      onSearch(inputRef.current.value);
      console.log(inputRef.current.value);
    }
  };

  return (
    <form  onSubmit={handleSearch}>
      <InputGroup>
        <InputLeftElement children={<BsSearch />} />
        <Input ref={inputRef}   borderColor={"gray.500"}
            borderRadius={20}
            placeholder="Search games..."
            variant={"filled"} />
      </InputGroup>
    </form >
  );
};

export default SearchInput;

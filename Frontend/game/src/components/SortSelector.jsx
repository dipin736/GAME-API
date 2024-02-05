import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React from 'react'
import { BsChevronRight } from 'react-icons/bs'

const SortSelector = () => {
  const sortOrders=()=>[
    {value :'',label:'Revelance'},
    {value :'-added',label:'Date Added'},
    {value :'-release',label:'Release Date'},
    {value :'-ratings',label:'Average Ratings'},


  ]
  return (
    <Menu>
        <MenuButton margin={2} as={Button} rightIcon={<BsChevronRight/>}>Order By:Relevance</MenuButton>
        <MenuList>
            <MenuItem>Relevance</MenuItem>
            <MenuItem>Date Added</MenuItem>
            <MenuItem>Release Date</MenuItem>
            <MenuItem>Average Ratings</MenuItem>
        </MenuList>
    </Menu>
  )
}

export default SortSelector


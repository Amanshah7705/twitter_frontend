import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import Navbar from '../Home/Home';

const HomePage = () => {
  return (
    <div>
        <div>
        <Navbar/>
        </div>
       
        <div>
        <Flex
      justify="center"
      align="center"
      direction="column"
      h="100vh"
      bgGradient="linear(to-r, teal.500, cyan.500)"
    >
      <Heading as="h1" size="2xl" color="white" mb={8} textAlign="center">
        Welcome Home!
      </Heading>
      
    </Flex>
        </div>

    </div>
  );
};

export default HomePage;

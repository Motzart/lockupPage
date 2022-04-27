import React, { useContext, useEffect } from 'react';
import { appStore, onAppMount } from '~state/app';
import { NavBar } from '~components/navBar';
import { Content } from '~components/content';
import { useLockup } from '~hooks/useLockup';

function App() {
  const { dispatch } = useContext(appStore);

  const onMount = () => {
    dispatch(onAppMount());
  };

  useEffect(onMount, []);

  const lookups = useLockup();

  return (
    <>
      <NavBar/>
      {lookups && <Content lookups={lookups}/>}
    </>
  );
}

export default App;

import React from "react";
import styled from "styled-components";

const AddTerp = ({ oTerp }) => {
  const handleClick = async () => {
    const newTerpId = await oTerp.NewTerp();

    console.log(`Interpreter #${newTerpId} has been added!`);

    oTerp.NavToTerp(newTerpId);
  };

  return (
    <>
      <TerpAdderButton onClick={handleClick}>
        Add New Interpreter
      </TerpAdderButton>
    </>
  );
};

export default AddTerp;

const TerpAdderButton = styled.button`
  border-radius: 8px;
  background-color: #9225c1;
  color: antiquewhite;
  font-size: 20px;
  font-weight: 700;
  border: none;
  padding: 8px;
  margin-top: 8px;
  box-shadow: 1px 1px #555;
  cursor: pointer;
`;

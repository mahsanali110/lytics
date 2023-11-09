import React from 'react';
import PDF, { Text, AddPage, Line, Image, Table, Html } from 'jspdf-react';

function ChannelAnalyticsPDF({ imageString }) {
  // const styles = StyleSheet.create({
  //   mainView: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     margin: '10px 0px',
  //     width: '50vw',
  //     // justifyContent: 'center',
  //     // alignItems: 'center',
  //   },
  // });
  const styleH1 = {
    fontSize: '15px',
    textAlign: 'center',
    color: 'red',
  };
  const invisibleStyle = {
    display: 'none',
  };
  const properties = { header: 'Acme' };
  const head = [['ID', 'Name', 'Country']];
  const body = [
    [1, 'Shaw', 'Tanzania'],
    [2, 'Nelson', 'Kazakhstan'],
    [3, 'Garcia', 'Madagascar'],
  ];

  return (
    // <Document>
    //   <Page size="A4">
    //     <View>
    //       <Text>something</Text>
    //       <Image src={imageString}></Image>
    //     </View>
    //   </Page>
    // </Document>
    <React.Fragment>
      {/* <Document>
        <Page size="A4"> */}
      <PDF properties={properties} preview={true}>
        <Text x={35} y={25} size={40}>
          Octonyan loves jsPDF
        </Text>
        {/* <Image src={imageString} x={15} y={40} width={180} height={180} />
        <AddPage />
        <Table head={head} body={body} />
        <AddPage format="a6" orientation="l" />
        <Text x={10} y={10} color="red">
          Sample
        </Text>
        <Line x1={20} y1={20} x2={60} y2={20} />
        <AddPage />
        <Html sourceById="page" /> */}
      </PDF>
      {/* </Page>
      </Document> */}
    </React.Fragment>
  );
}

export default ChannelAnalyticsPDF;

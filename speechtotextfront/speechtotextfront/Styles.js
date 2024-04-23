import styled from "styled-components"

export const Container = styled.View`
width: 100%;
background-color: #1c1c1c;
height: 100%;
`

export const Content = styled.View`
align-items: center;
gap: 70px;
justify-content: center;
flex-direction: column;
height: 100%;
border: 2px solid green;
`

export const Box = styled.TouchableOpacity`
width: 100px;
height: 100px;
justify-content: center;
align-items: center;

`

export const AudioVisu = styled.TouchableOpacity`
width: 300px;
height: 300px;
margin-top: 20%;
`

export const Gif = styled.Image`
width: 300px;
height: 300px;
`

export const Picture = styled.Image`
width: 300px;
height: 300px;
`

export const ConvertText = styled.Text`
color: white;
font-family: 'Nunito_600SemiBold';
font-size: 20px;
`

export const Footer = styled.View`
flex-direction: row;
justify-content: center;
align-items: center;
`

export const ChatBox = styled.TextInput`
height: 40%;
border: 2px solid white;
border-radius: 12%;
width: 220px;
color: white;
`

export const ContenChat = styled.View`
flex-direction: row;
justify-content: center;
gap: -20%;
align-items: center;
`
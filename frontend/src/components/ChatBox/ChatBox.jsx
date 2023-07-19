import React, { useEffect, useState } from "react";

import "./ChatBox.css";
import ChatBoxFeed from "./ChatBoxFeed";
import {
  clearOpenAiChat,
  openAiSendMessage,
} from "../../service/openaiService";
import { getSentEmails } from "../../service/emailService";
import { transformInputPrompt, detectTriggeredDefences } from "../../service/defenceService";

function ChatBox(props) {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messages, setMessages] = useState([]);

  // called on mount
  useEffect(() => {
    // clear remote messages
    clearOpenAiChat();
    // get sent emails
    getSentEmails().then((sentEmails) => {
      props.setEmails(sentEmails);
    });
  }, []);

  const clearClicked = () => {
    // clear local messages
    setMessages([]);
    // clear remote messages
    clearOpenAiChat();
  };

  const sendChatMessage = async (event) => {
    if (event.key === "Enter" && !isSendingMessage) {
      setIsSendingMessage(true);
      // get the message
      const message = event.target.value;
      // apply defense transformations to the input
      const transformedMessage = await transformInputPrompt(message);
      const isTransformed = transformedMessage !== message;

      // if input has been edited, add both messages to the list of messages. otherwise add original message only
      setMessages((messages) => [
        ...messages,
        { message: message, isUser: true, isOriginalMessage: true },
      ]);
      if (isTransformed) {
        setMessages((messages) => [
          ...messages,
          {
            message: transformedMessage,
            isUser: true,
            isOriginalMessage: false,
          },
        ]);
      }
      // clear the input
      event.target.value = "";

      // check if original input triggers any defence mechanisms
      const triggeredDefenceCheck = await detectTriggeredDefences(transformedMessage)
      // defence info from the user input
      const defenceInfo = triggeredDefenceCheck.defenceInfo;

      let reply;
      // if the user input is blocked, set reply to blocked message
      if (defenceInfo.blocked){
        reply = triggeredDefenceCheck;
      } else {
        // if not blocked, send the message to chatgpt and get reply 
       reply = await openAiSendMessage(transformedMessage);
       
       // update the defence info with the reply info
       defenceInfo.blocked = reply.defenceInfo.blocked;
       defenceInfo.triggeredDefences = defenceInfo.triggeredDefences.concat(reply.defenceInfo.triggeredDefences);
      }
      // add it to the list of messages
      setMessages((messages) => [
        ...messages,
        { isUser: false, message: reply.reply, defenceInfo: defenceInfo },
      ]);
      // update triggered defences
      props.updateTriggeredDefences(defenceInfo.triggeredDefences);

      // we have the message reply
      setIsSendingMessage(false);

      // get sent emails
      const sentEmails = await getSentEmails();
      // update emails
      props.setEmails(sentEmails);
    }
  };

  return (
    <div id="chat-box">
      <ChatBoxFeed messages={messages} />
      <div id="chat-box-footer">
        <div id="chat-box-input">
          <input
            type="text"
            placeholder="chat to chatgpt..."
            autoFocus
            onKeyUp={sendChatMessage.bind(this)}
          />
        </div>
        <div id="chat-box-button" onClick={clearClicked.bind(this)}>
          <button>clear</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

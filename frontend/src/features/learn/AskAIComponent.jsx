import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChatReply } from '../../hooks/useAI';
import AskAIIcon from '../../assets/ask-ai.png';
import { FaUserCircle } from 'react-icons/fa';

const AskAIContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-height: 800px;
  background-color: #f7f9fc;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const ChatWindow = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-direction: ${({ role }) => (role === 'user' ? 'row-reverse' : 'row')};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const MessageBubble = styled.div`
  padding: 1rem;
  border-radius: 14px;
  max-width: 70%;
  font-size: 1rem;
  color: #2c3e50;
  white-space: pre-wrap;
  background-color: ${({ role }) => (role === 'user' ? '#dbeafe' : '#eef1f7')};
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  resize: none;
  height: 100px;
  background: #fff;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: var(--primary-color, #6c5ce7);
  }
`;

const Button = styled.button`
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #574b90;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function AskAIComponent() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const { mutate: askAI, isPending } = useChatReply();
  const bottomRef = useRef();

  const handleAsk = () => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const updatedHistory = [...history, { role: 'user', text: trimmed }];

    askAI(
      { history: updatedHistory, message: trimmed },
      {
        onSuccess: (reply) => {
          setHistory([...updatedHistory, { role: 'model', text: reply }]);
          setQuestion('');
        },
        onError: (err) => {
          setHistory([
            ...updatedHistory,
            { role: 'model', text: err.message || 'Error occurred.' },
          ]);
        },
      }
    );
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <AskAIContainer>
      <ChatWindow>
        {history.map((entry, index) => (
          <MessageWrapper key={index} role={entry.role}>
            <Avatar>
              {entry.role === 'user' ? (
                <FaUserCircle size={36} color="black" />
              ) : (
                <AvatarImage src={AskAIIcon} alt="AI Avatar" />
              )}
            </Avatar>
            <MessageBubble role={entry.role}>{entry.text}</MessageBubble>
          </MessageWrapper>
        ))}
        <div ref={bottomRef} />
      </ChatWindow>

      <InputArea>
        <TextArea
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button onClick={handleAsk} disabled={!question.trim() || isPending}>
          {isPending ? 'Thinking...' : 'Ask'}
        </Button>
      </InputArea>
    </AskAIContainer>
  );
}

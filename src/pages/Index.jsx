import { Box, VStack, HStack, IconButton, Input, Textarea, useColorModeValue, Heading, useToast, Container, Spacer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaPencilAlt, FaSave } from "react-icons/fa";
import { useState } from "react";

const Note = ({ note, onDelete, onEdit }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" bg={useColorModeValue("white", "gray.700")}>
      <HStack justifyContent="space-between">
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          {note.title}
        </Text>
        <IconButton icon={<FaPencilAlt />} isRound="true" onClick={() => onEdit(note)} />
        <IconButton icon={<FaTrash />} isRound="true" onClick={() => onDelete(note.id)} />
      </HStack>
      <Text mt={4}>{note.content}</Text>
    </Box>
  );
};

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleNewNote = () => {
    setTitle("");
    setContent("");
    setCurrentNote(null);
    onOpen();
  };

  const handleSaveNote = () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Title and content are required to add a note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
    };

    setNotes([...notes, newNote]);
    onClose();
    toast({
      title: "Note added",
      description: "Your note has been added successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNote(note);
    onOpen();
  };

  const handleUpdateNote = () => {
    setNotes(notes.map((note) => (note.id === currentNote.id ? { ...note, title, content } : note)));
    setCurrentNote(null);
    onClose();
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" p={5}>
      <VStack spacing={8}>
        <HStack w="100%">
          <Heading>Note Keeper</Heading>
          <Spacer />
          <IconButton size="md" fontSize="lg" aria-label={`Add note`} variant="ghost" color="current" marginLeft="2" icon={<FaPlus />} onClick={handleNewNote} />
        </HStack>
        <Wrap spacing="30px" justify="center">
          {notes.map((note) => (
            <WrapItem key={note.id} w="300px">
              <Note note={note} onDelete={handleDeleteNote} onEdit={handleEditNote} />
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentNote ? "Edit Note" : "New Note"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input placeholder="Title" mb={3} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={currentNote ? handleUpdateNote : handleSaveNote}>
              {currentNote ? <FaSave /> : <FaPlus />} {currentNote ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;

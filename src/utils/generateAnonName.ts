const animals = ['Falcão', 'Cervo', 'Lobo', 'Águia', 'Tigre'];
const colors = ['Azul', 'Laranja', 'Verde', 'Vermelho', 'Preto'];

export const generateAnonName = () => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `${animal} ${color}`;
};
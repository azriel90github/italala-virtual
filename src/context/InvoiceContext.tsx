import type React from "react";
import { createContext, useContext } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  pdf,
} from "@react-pdf/renderer";

// Registrar fonte personalizada (opcional)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" },
  ],
});

// Definir uma interface para os dados da encomenda
interface FormData {
  name: string;
  number: string;
  cityOrNeighborhood: string;
  landmark: string;
  flavors: number;
  payment: string;
  paymentMethod: string;
}

// Definir a interface para o contexto
interface InvoiceContextProps {
  generateInvoice: (formData: FormData) => JSX.Element;
  downloadInvoice: (formData: FormData) => Promise<void>;
}

// Criar o contexto para o provedor de faturas
const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#64395C",
    padding: 20,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    right: 5,
    width: 200, // Ajuste o tamanho da imagem
    height: "auto", // Mantém a proporção
    //opacity: 0.1, // Torna a imagem sutil para um efeito de fundo
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 65,
    paddingBottom: 10,
  },
  descricaoLogo: {
    fontSize: 13,
    color: "#f3f4f6",
  },
  address: {
    display: "flex",
    justifyContent: "flex-end", // Alinha todo o conteúdo à direita
    alignItems: "flex-end", // Ajusta alinhamento vertical se necessário
    marginTop: 0,
  },
  addressp: {
    color: "#f3f4f6",
    fontSize: 10,
    lineHeight: 1.5,
  },
  sectionTitle: {
    color: "#3D1A36",
    fontSize: 18,
    marginBottom: 12,
  },
  dataBox: {
    lineHeight:1,
    borderRadius: 8,
  },
  text: {
    color: "#f3f4f6",
    fontSize: 12,
    marginBottom: 5,
  },
  summaryBox: {
    display: "flex",
    flexDirection: "row", // Alinha os itens em linha
    justifyContent: "space-between", // Distribui os itens com espaçamento uniforme
    alignItems: "center", // (Opcional) Alinha os itens verticalmente ao centro
    backgroundColor: "#7C4A73",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  contentBox: {
    flex: 1, // Permite que esta View ocupe o espaço necessário
  },
  summaryText: {
    color: "#f3f4f6",
    fontSize: 12,
    lineHeight: 2,
  },
  moneyColor: {
    color: "#22c55e",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "#f3f4f6",
    fontSize: 10,
  },
});

// Provedor de faturas
export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Função para gerar a fatura como PDF
  const generateInvoice = (formData: FormData): JSX.Element => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Imagem de fundo */}
          <Image
            style={styles.backgroundImage}
            src="/ice-cream 2.png"  
          />
          {/* Cabeçalho */}
          <View style={styles.header}>
            {/* Logo */}
            <View>
              <Image style={styles.logo} src="/logo-geladaria.png" />
              <Text style={styles.descricaoLogo}>Faça sua encomenda de qualquer lugar e a qualquer hora!</Text>
            </View>
            {/* Endereço */}
            <View style={styles.address}>
              <Text style={styles.addressp}>Avenida Comandante Valodia nº 69</Text>
              <Text style={styles.addressp}>Largo do Kinaxixi, Luanda</Text>
              <Text style={styles.addressp}>Angola</Text>
            </View>
          </View>

          {/* Dados do Cliente */}
          <View style={styles.dataBox}>
            <Text style={styles.sectionTitle}>Dados do Cliente</Text>
            <Text style={styles.text}>Nome: {formData.name}</Text>
            <Text style={styles.text}>Número: {formData.number}</Text>
            <Text style={styles.text}>
              Cidade ou bairro: {formData.cityOrNeighborhood}
            </Text>
            <Text style={styles.text}>
              Ponto de referência: {formData.landmark}
            </Text>
          </View>

          {/* Resumo da Encomenda */}
          <View style={styles.summaryBox}>
            <View style={styles.contentBox}>
              <Text style={styles.sectionTitle}>Resumo da Encomenda</Text>
              <Text style={styles.summaryText}>
                Total de Sabores: <Text style={styles.moneyColor}>{formData.flavors}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Total de Pagamento: <Text style={styles.moneyColor}>{formData.payment}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Método de Pagamento: <Text style={styles.moneyColor}>{formData.paymentMethod}</Text>
              </Text>
            </View>
            <View style={styles.contentBox}>
              <Image style={styles.logo} src="/logo-geladaria.png" />
            </View>
          </View>

          {/* Rodapé */}
          <Text style={styles.footer}>Obrigado pela sua compra!</Text>
        </Page>
      </Document>
    );
  };

  // Função para gerar e baixar o PDF
  const downloadInvoice = async (formData: FormData): Promise<void> => {
    const invoiceComponent = generateInvoice(formData); // Gera a fatura como componente
    const blob = await pdf(invoiceComponent).toBlob(); // Converte para Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fatura_${formData.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <InvoiceContext.Provider value={{ generateInvoice, downloadInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Hook para usar o contexto de faturas
export const useInvoice = (): InvoiceContextProps => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice deve ser usado dentro de um InvoiceProvider");
  }
  return context;
};



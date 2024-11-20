import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontSize: 12,
  },
  value: {
    flex: 1,
    fontSize: 12,
  },
});

export const FormDetailsPDF = ({ submission }: { submission: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Application Details</Text>

      {/* Applicant Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Applicant Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{submission.userName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{submission.userEmail}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Role Type:</Text>
          <Text style={styles.value}>{submission.formType}</Text>
        </View>
      </View>

      {/* Form Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Details</Text>
        {Object.entries(submission.formData).map(([key, value]: [string, any]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}:</Text>
            <Text style={styles.value}>
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </Text>
          </View>
        ))}
      </View>

      {/* Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uploaded Documents</Text>
        {Object.entries(submission.files || {}).map(([key, file]: [string, any]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}:</Text>
            <Text style={styles.value}>{file.originalName}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
); 
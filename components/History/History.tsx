import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiHistory, { History } from '../../API/apiHistory';
import { getAddressFromCoordinates } from '../../API/apiGoogleMap';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigateButton from '../NavigateButton/NavigateButton';

const HistoryScreen = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false); // State để kiểm tra chế độ refresh
  const navigation = useNavigation();

  useEffect(() => {
    fetchHistories(false); // Gọi lần đầu tiên mà không làm mới dữ liệu
  }, [page]);

  const fetchHistories = async (isRefreshing = false) => {
    setLoading(true);
    try {
      const data = await apiHistory.getAllHistory(page, 10);
      await Promise.all(
        data.map(async (history) => {
          const address_api = await getAddressFromCoordinates(
            history.latitude,
            history.longitude,
          );
          history.address = address_api;
        }),
      );
      setHistories((prev) => (isRefreshing ? data : [...prev, ...data])); // Làm mới khi isRefreshing = true
    } catch (error) {
      console.error('Error fetching histories:', error);
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchHistories(true); // Gọi hàm fetch với chế độ làm mới
  };

  const renderClassItem = ({ item, index }) => (
    <View style={styles.classItem}>
      <View style={styles.classContent}>
        <View
          style={[
            styles.card,
            { backgroundColor: index % 2 === 0 ? '#FAFAD2' : '#E0FFFF' },
          ]}
        >
          <View style={styles.left}>
            <Text
              style={[
                styles.cardTitle,
                { color: item.status === 'nofall' ? '#35AD3D' : 'red' },
              ]}
            >
              {item.status === 'nofall' ? 'Safe' : 'Fall Detected'}
            </Text>
            <Text style={styles.cardDate}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
            <Text style={styles.cardDate} numberOfLines={1} ellipsizeMode="tail">
              Location: {item.address}
            </Text>
          </View>
          <View style={styles.right}>
            <View style={styles.row}>
              <Text> aX: {item.accelX.toFixed(2)}</Text>
              <Text> aY: {item.accelY.toFixed(2)}</Text>
              <Text> aZ: {item.accelZ.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text> gX: {item.gyroX.toFixed(2)}</Text>
              <Text> gY: {item.gyroY.toFixed(2)}</Text>
              <Text> gZ: {item.gyroZ.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItemSeparator = () => (
    <View style={styles.separatorContainer}>
      <View style={styles.timelineLine}></View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name="arrow-left"
          size={24}
          color="#2BA7E9"
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 18, marginBottom: 18 }}
        />
        <Text style={styles.title}>Timeline</Text>
        <Icon
          name="refresh"
          size={24}
          color="#2BA7E9"
          onPress={handleRefresh} // Gọi hàm handleRefresh khi bấm nút refresh
          style={{ paddingTop: 8, marginLeft: 12 }}
        />
      </View>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}
          ItemSeparatorComponent={renderItemSeparator}
          data={histories}
          renderItem={renderClassItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            setPage((prevPage) => prevPage + 1); // Tăng trang để tải thêm dữ liệu
          }}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh} // Thêm tính năng kéo để làm mới danh sách
        />
      )}
      <NavigateButton page={'History'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#FFF2EE',
  },
  loader: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ff7f50',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
  },
  left: {
    flexDirection: 'column',
  },
  right: {
    flexDirection: 'column',
    marginTop: 8,
  },
  classItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 8,
    height: 60,
    backgroundColor: '#AEFF30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  classContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#00008B',
    width: 150,
    marginBottom: 8,
  },
});

export default HistoryScreen;

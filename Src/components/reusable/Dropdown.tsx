import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/contex/ThemeContex';

interface DropdownProps {
  options: string[]; // Options for the dropdown
  onOptionSelect: (option: string) => void; // Function to handle option selection
  triggerElement: React.ReactNode; // The element that triggers the dropdown (could be any element, not just a button)
  dropdownStyle?: ViewStyle; // Custom style for the dropdown
  optionStyle?: ViewStyle; // Custom style for dropdown options
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onOptionSelect,
  triggerElement,
  dropdownStyle,
  optionStyle,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { colors } = useTheme();
  
  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Dropdown item selection
  const handleSelect = (option: string) => {
    onOptionSelect(option);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <View style={styles.container}>
      {/* Trigger Element */}
      <TouchableOpacity onPress={toggleDropdown}>
        {triggerElement}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <Animated.View style={[styles.dropdown, dropdownStyle]}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={[styles.option, optionStyle]}>
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Ensures dropdown is positioned correctly
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
    elevation: 5, // Adds shadow effect for Android
    zIndex: 1000,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
  },
});

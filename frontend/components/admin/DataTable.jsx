import { useState } from 'react';

const DataTable = ({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = '搜索...',
  searchKey = 'name'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤数据
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const value = item[searchKey]?.toString()?.toLowerCase();
    return value?.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {onAdd && (
          <button 
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700"
            onClick={onAdd}
          >
            添加{title.split('管理')[0]}
          </button>
        )}
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {onEdit && (
                        <button
                          className="text-orange-600 hover:text-orange-900 mr-3"
                          onClick={() => onEdit(item)}
                        >
                          编辑
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => onDelete(item.id)}
                        >
                          删除
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
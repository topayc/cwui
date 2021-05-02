<%!
class VFileTable extends java.util.Hashtable {
	
	String FILE_EXT = ".jcerObjs";
	java.io.FilenameFilter FILE_LIST_FILTER = new java.io.FilenameFilter() {
		public boolean accept(java.io.File dir, String name) {
			if( name.endsWith(FILE_EXT) ) {
				System.out.println( "하하하" );
				return true;
			}
			System.out.println( "ㅎㅎㅎㅎ" );
			return false;
		}
	};
	
	private String storePath = null;
	
	public VFileTable(String storePath, String tableKey) {
		FILE_EXT += tableKey;
		if( storePath.endsWith("/") || storePath.endsWith("\\") ) {
			storePath = storePath.substring(0, storePath.length()-1);
		}
		java.io.File storePathCr = new java.io.File(storePath);
		if( !storePathCr.isDirectory() ) {
			storePathCr.mkdirs();
		}
		this.storePath = storePath;
	}
	
	protected String getStorePath() {
		return storePath;
	}
	
	protected java.io.File[] listFiles() {
		return new java.io.File( getStorePath() ).listFiles( FILE_LIST_FILTER );
	}

	public synchronized void clear() {
		java.io.File list[] = listFiles();
		if( list != null && list.length > 0 ) {
			for (int i = 0; i < list.length; i++) {
				list[i].delete();
			}
		}
	}

	public synchronized Object clone() {
		return new VFileTable( getStorePath(), FILE_EXT );
	}

	public synchronized boolean contains(Object value) {
		throw new RuntimeException();
	}

	public synchronized boolean containsKey(Object key) {
		java.io.File tarFile = new java.io.File( getPath(key) );
		return tarFile.isFile();
	}

	public boolean containsValue(Object value) {
		throw new RuntimeException();
	}

	public synchronized java.util.Enumeration elements() {
		final java.io.File fileList[] = listFiles();
		return new java.util.Enumeration() {
			int count = 0;
			
			public boolean hasMoreElements() {
				if( fileList == null ) {
					return false;
				}
				if( fileList.length <= count ) {
					return false;
				}
				return true;
			}

			public Object nextElement() {
				java.io.File file = fileList[count];
				count++;
				java.io.FileInputStream fins = null;
				Object rObj = null;
				try {
					fins = new java.io.FileInputStream(file);
					java.io.ObjectInputStream oIns = new java.io.ObjectInputStream( fins );
					rObj = oIns.readObject();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						fins.close();
					} catch (Exception e) {
					}
				}
				return rObj;
			}
		};
	}

	public java.util.Set entrySet() {
		throw new RuntimeException();
	}

	public synchronized boolean equals(Object o) {
		return super.equals(o);
	}

	public synchronized Object get(Object key) {
		java.io.File file = new java.io.File( getPath(key) );
		if( file.isFile() ) {
			java.io.FileInputStream fins = null;
			Object rObj = null;
			try {
				fins = new java.io.FileInputStream(file);
				java.io.ObjectInputStream oIns = new java.io.ObjectInputStream( fins );
				rObj = oIns.readObject();
			} catch (Exception e) {
				file.delete();
				e.printStackTrace();
			} finally {
				try {
					fins.close();
				} catch (Exception e) {
				}
			}
			return rObj;
		} else {
			return null;
		}
	}

	public synchronized int hashCode() {
		return super.hashCode();
	}

	public synchronized boolean isEmpty() {
		java.io.File list[] = listFiles();
		if( list != null ) {
			return true;
		}
		return false;
	}

	public synchronized java.util.Enumeration keys() {
		final java.io.File list[] = listFiles();
		return new java.util.Enumeration() {
			int count = 0;

			public boolean hasMoreElements() {
				if( list == null ) {
					return false;
				}
				if( list.length <= count ) {
					return false;
				}
				return true;
			}

			public Object nextElement() {
				java.io.File file = list[count];
				count++;
				String fileName = file.getName();
				return fileName.substring(0, fileName.length()-FILE_EXT.length());
			}
		};
	}

	public java.util.Set keySet() {
		throw new RuntimeException();
	}

	public synchronized Object put(Object key, Object value) {
		java.io.File file = new java.io.File( getPath(key) );
		java.io.FileOutputStream fos = null;
		//System.out.println( file );
		try {
			fos = new java.io.FileOutputStream( file );
			java.io.ObjectOutputStream oos = new java.io.ObjectOutputStream( fos );
			oos.writeObject( value );
			oos.flush();
			fos.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fos.close();
			} catch (Exception e) {
			}
		}
		return value;
	}

	public synchronized void putAll(java.util.Map t) {
		throw new RuntimeException();
	}

	protected void rehash() {
		super.rehash();
	}
	
	private String getPath(Object key) {
		StringBuffer sb = new StringBuffer();
		sb.append( storePath );
		sb.append( java.io.File.separator );
		sb.append( key.toString() );
		sb.append( FILE_EXT );
		return sb.toString();
	}

	public synchronized Object remove(Object key) {
		Object obj = get( key );
		if( obj != null ) {
			new java.io.File( getPath(key) ).delete();
			return obj;
		}
		return null;
	}

	public synchronized int size() {
		new java.io.File( storePath ).listFiles();
		String list[] = new java.io.File( storePath ).list();
		int rSize = 0;
		if( list != null ) {
			rSize = list.length;
		}
		return rSize;
	}

	public synchronized String toString() {
		return "VFileTable.toString() not support";
	}

	public java.util.Collection values() {
		throw new RuntimeException();
	}
}
%>
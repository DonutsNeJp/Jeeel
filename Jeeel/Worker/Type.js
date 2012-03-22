
/**
 * Worker内で使用されるイベントタイプを示す列挙体
 */
Jeeel.Worker.Type = {
    
    /**
     * Scriptのインポートイベント
     * 
     * @type String
     * @constant
     */
    IMPORT_SCRIPT: 'import',
    
    /**
     * Scriptの実行イベント
     * 
     * @type String
     * @constant
     */
    EXECUTE_SCRIPT: 'script',
    
    /**
     * タスク追加イベント
     * 
     * @type String
     * @constant
     */
    ADD_TASK: 'add-task',
    
    /**
     * タスク実行イベント
     * 
     * @type String
     * @constant
     */
    EXECUTE_TASK: 'execute'
};

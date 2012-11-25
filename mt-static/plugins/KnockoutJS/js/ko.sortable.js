/**
 * jQuery UI sortable を適用するカスタムバインディング
 * @depend jQuery 1.3.2+, jQuery UI 1.8.22
 * @author sukobuto.com
 */

ko.bindingHandlers['sortable'] = {
	init : function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var config = valueAccessor();
		if (!config) return;

		// オプションイベントハンドラの準備
		var dummyFunc = function(){};
		var ehs = ko.utils.extend({
			itemAdding: dummyFunc,
			itemAdd: dummyFunc,
			itemRemove: dummyFunc,
			itemSort: dummyFunc,
			itemDisposing: dummyFunc,
			itemDisposed: dummyFunc
		}, config);

		var allBindings = allBindingsAccessor();
		var array = allBindings.foreach
				|| (allBindings.template ? allBindings.template.foreach : false);

		var $list = jQuery(element);

		if (array) {	// foreachでリストがバインドされている場合

			$list
				.data('ko-sort-array', array)
				.sortable(config)
				.bind('sortstart', function(event, ui) {
					// ドラッグを開始した際に発火するイベントのハンドラ
					// 対応するアイテムをDOM要素にタグ付けする
					var item = ko.dataFor(ui.item.get(0));
					ui.item.data('ko-binded-item', item);
					ui.item.data('ko-sort-array', array);
					ui.item.data('ko-sort-index', array.indexOf(item));
				}).bind('sortreceive', function(event, ui) {
					// 別のリストからアイテムがドロップされた際に発火するイベントのハンドラ
					var item = ui.item.data('ko-binded-item');
					var oldIndex = ui.item.data('ko-sort-index');
					var newElmIndex = ui.item.index();
					var newIndex = 0;
					if (newElmIndex != 0) {
						// 論理削除されたアイテムの混在を考慮して正しいインデックスを取得
						var tmp = ko.dataFor($list[0].children[newElmIndex]);
						newIndex = array.indexOf(tmp) + 1;
					}
					if (ehs.itemAdding(item, array, oldIndex, newIndex) === false) {
						$(ui.sender).sortable('cancel');
						return;
					}
				}).bind('sortupdate', function(event, ui) {
					// アイテムのドラッグ＆ドロップが完了し、DOM要素の更新が完了した際に発火するイベントのハンドラ
					// 自リストへのドロップであれば、バインドされた配列を操作して対応するアイテムを移動する
					var $newList = ui.item.parent();
					var item = ui.item.data('ko-binded-item');
					var oldIndex = ui.item.data('ko-sort-index');
					if ($newList[0] == $list[0]) {	//自リストへのドロップであるか
						var oldArray = ui.item.data('ko-sort-array');
						var newArray = $newList.data('ko-sort-array');
						var newElmIndex = ui.item.index();
						var newIndex = 0;
						ui.item.remove();
						oldArray.remove(item);
						if (newElmIndex != 0) {
							// 論理削除されたアイテムの混在を考慮して正しいインデックスを取得
							var tmp = ko.dataFor($list[0].children[newElmIndex - 1]);
							newIndex = newArray.indexOf(tmp) + 1;
						}
						newArray.splice(newIndex, 0, item);
						event.newIndex = newIndex;
						if (oldArray == newArray) ehs.itemSort(item, array, oldIndex, newIndex);
						else ehs.itemAdd(item, array, oldIndex, newIndex);
					}
				}).bind('sortremove', function(event, ui) {
					var item = ui.item.data('ko-binded-item');
					var oldIndex = ui.item.data('ko-sort-index');
					ehs.itemRemove(item, array, oldIndex);
				});


		} else if (config.trashBox) {		// リストがバインドされておらず、trashBoxオプションがある場合

			$list
				.sortable(config)
				.bind('sortreceive', function(event, ui) {
					// 別のリストからアイテムがドロップされた際に発火するイベントのハンドラ
					// ドラッグ元にバインドされているリストから、ドロップされたアイテムを削除する
					var oldArray = ui.item.data('ko-sort-array');
					var item = ui.item.data('ko-binded-item');
					if (ehs.itemDisposing(item) === false) {
						$(ui.sender).sortable('cancel');
						return;
					}
					ui.item.fadeOut(200, function() {
						ui.item.remove();
					});
					if (config.trashBox == 'destroy') {
						oldArray.remove(item);
						oldArray.push(item);
						oldArray.destroy(item);
					}
					else oldArray.remove(item);
					ehs.itemDisposed(item);
				});

		}
	}
};
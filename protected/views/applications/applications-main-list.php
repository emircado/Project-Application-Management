<div id="app-main-list" class="table-main" style="display:none";>
    <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
    <fieldset>
        <input type="hidden" id="app-main-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="table-header-block">
            <div class="header-block-button">
                <a id="app-main-list-create-button" class="button round blue image-right ic-add text-upper" href="#">Create Application</a>
            </div><!-- End Header Block Button -->

            <div class="header-block-side">
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="app-main-list-part"></span>
                        <span class="all-page" id="app-main-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="app-main-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="app-main-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div><!-- End Header Block Side -->
        </div><!-- End Table Header Block -->
        
        <div id="content-div">
            <table id="test">
                <thead>
                    <tr>                      
                        <th width="200">Name</th>
                        <th width="200">Project</th>
                        <th width="200">R&D Point Person</th>
                        <th>Description</th>
                        <th width="50"></th>
                    </tr>
                    <tr>
                        <th><input id="app-main-list-search-name" type="text" style="width:180px;"/></th>
                        <th><input id="app-main-list-search-project" type="text" style="width:180px;"/></th>
                        <th><input id="app-main-list-search-point" type="text" style="width:180px;"/></th>
                        <th></th>
                        <th>
                            <div><button id="app-main-list-search-button" class="red-button">Search</button></div>
                            <a href="#" id="app-main-list-clear-button">Clear</a>
                            <a href="#" id="app-main-list-advanced-button">Advanced Search</a>
                        </th>
                    </tr>
                </thead>
                <tbody id="app-main-list-table"></tbody>
            </table>
        </div>
    </fieldset>
    </form> <!--this is for the CHtml form-->
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->
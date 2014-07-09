<div id="users-list" class="table-main" style="display:block";>
    <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
    <fieldset>
        <input type="hidden" id="users-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="table-header-block" style="margin-bottom:10px;">
            <div class="header-block-side">
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="users-list-part"></span>
                        <span class="all-page" id="users-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="users-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="users-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div><!-- End Header Block Side -->
        </div><!-- End Table Header Block -->
        
        <div id="content-div">
            <table>
                <thead>
                    <tr>                      
                        <th width="200">Name</th>
                        <th width="200">Application</th>
                        <th width="">Description</th>
                        <th width="50"></th>
                    </tr>
                    <tr>
                        <th><input id="users-list-username" type="text" style="width:180px;"/></th>
                        <th><input id="users-list-name" type="text" style="width:180px"/></th>
                        <th></th>
                        <th><div><button id="users-list-search-button" class="red-button">Search</button></div><a href="#" id="users-list-clear-button">Clear</a></th>
                    </tr>
                </thead>
                <tbody id="users-list-table"></tbody>
            </table>
        </div>
        
    </fieldset>
    </form> <!--this is for the CHtml form-->
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->